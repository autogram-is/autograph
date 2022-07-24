type SqlValue = string | number;
type SqlMultiValue = SqlValue[];
type SqlAnyValue = SqlValue | SqlMultiValue;

export const Where = () => new WhereBuilder();
export class WhereBuilder {
  parameters: SqlValue[] = [];
  private clauses: string[] = [];
  get sql(): string {
    return ' ' + this.clauses.join('\n AND ');
  }

  toString(): string {
    const stack: any[] = [...this.parameters];
    return this.sql.replace('@', () => stack.pop().toString());
  }

  private columnize(column: string) {
    return column.startsWith('$') ? `json_extract(data, '${column}')` : column;
  }

  private placeholder(value: SqlAnyValue): string {
    return typeof value === 'string' ? "'@'" : '@';
  }

  addRaw(clause: string, parameters?: SqlAnyValue) {
    this.clauses.push(clause);
    if (parameters) {
      if (typeof parameters === 'string' || typeof parameters === 'number') {
        this.parameters.push(parameters);
      } else {
        this.parameters.concat(parameters);
      }
    }
    return this;
  }

  add(property: string, predicate: string, value: SqlAnyValue) {
    return this.addRaw(
      `${this.columnize(property)} ${predicate} ${this.placeholder(value)}`,
      value
    );
  }

  equals(property: string, value: SqlValue): WhereBuilder {
    return this.add(property, '=', value);
  }

  notEquals(property: string, value: SqlValue): WhereBuilder {
    return this.add(property, '!=', value);
  }

  greater(property: string, value: SqlValue): WhereBuilder {
    return this.add(property, '>', value);
  }

  less(property: string, value: SqlValue): WhereBuilder {
    return this.add(property, '<', value);
  }

  greaterOrEquals(property: string, value: SqlValue): WhereBuilder {
    return this.add(property, '>=', value);
  }

  lessOrEquals(property: string, value: SqlValue): WhereBuilder {
    return this.add(property, '<=', value);
  }

  in(property: string, value: SqlMultiValue): WhereBuilder {
    const placeholders = value.map(v => this.placeholder(v)).join(',');
    return this.addRaw(this.columnize(property) + ' IN ' + placeholders, value);
  }

  notIn(property: string, value: SqlMultiValue): WhereBuilder {
    const placeholders = value.map(v => this.placeholder(v)).join(',');
    return this.addRaw(
      this.columnize(property) + ' NOT IN ' + placeholders,
      value
    );
  }

  isNull(property: string): WhereBuilder {
    return this.addRaw(`${this.columnize(property)} IS NULL`);
  }

  notNull(property: string): WhereBuilder {
    return this.addRaw(`${this.columnize(property)} IS NOT NULL`);
  }

  like(property: string, value: string): WhereBuilder {
    return this.addRaw(`${this.columnize(property)} LIKE '%@%'`, value);
  }

  startsWith(property: string, value: string): WhereBuilder {
    return this.addRaw(`${this.columnize(property)} LIKE '@%'`, value);
  }

  endsWith(property: string, value: string): WhereBuilder {
    return this.addRaw(`${this.columnize(property)} LIKE '%@'`, value);
  }

  notLike(property: string, value: string): WhereBuilder {
    return this.addRaw(`${this.columnize(property)} NOT LIKE '%@%'`, value);
  }
}
