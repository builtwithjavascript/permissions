import { IPermissionType } from './permission-type'

/**
 * @name IPermissionBuilder
 * @description
 * Helper to build permissions values
 * from specific keys, from a range of values,
 * or by excluding specific keys.
 */
export interface IPermissionBuilder {
  fromKeys(keys: string[]): number
  byExclusion(keysToExclude: string[]): number
  fromRange(fromValue: number, toValue: number): number
}

/**
 * @name PermissionBuilder
 * @description
 * Implements IPermissionBuilder helper functions
 * that can build permissions values from specific keys,
 * from a range of values, or by exluding specific keys.
 * @implements {IPermissionBuilder}
 * @param {IPermissionType} types - The permission types to use for building permissions.
 * @returns {IPermissionBuilder} An instance of PermissionBuilder.
 * @example
 * const permissionBuilder = new PermissionBuilder(permissionTypes);
 * const permissions = permissionBuilder.fromKeys(['View', 'Add']);
 * const permissionExcluding = permissionBuilder.byExclusion(['Delete']);
 * const permissionInRange = permissionBuilder.fromRange(1, 3);
 * @see IPermissionType
 * @see IPermissionBuilder
 * @see https://example.com/permissions-builder
 */
export class PermissionBuilder implements IPermissionBuilder {
  private types!: IPermissionType

  constructor(types: IPermissionType) {
    this.types = types
  }

  public fromKeys(keys: string[]): number {
    const types = this.types
    type keyType = keyof typeof types

    let permissions: number = 0
    keys.forEach((key) => {
      const value = this.types[key as keyType]
      const updated = permissions | value
      permissions = updated
    })
    return permissions
  }

  public byExclusion(keysToExclude: string[]): number {
    const keys: string[] = Object.getOwnPropertyNames(this.types).filter(
      (key) => keysToExclude.indexOf(key) === -1
    ) as string[]
    return this.fromKeys(keys)
  }

  public fromRange(fromValue: number, toValue: number): number {
    const types = this.types
    type keyType = keyof typeof types

    const keys: string[] = Object.getOwnPropertyNames(this.types) as string[]
    let permissions: number = 0

    keys.forEach((key) => {
      const value = this.types[key as keyType]
      if (value >= fromValue && value <= toValue) {
        const updated = permissions | value
        permissions = updated
      }
    })

    return permissions
  }
}
