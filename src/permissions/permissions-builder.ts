import { IPermissionType } from './permission-type'

/**
 * @name IPermissionsBuilder
 * @description
 * Helper to build permissions values
 * from specific keys, from a range of values,
 * or by excluding specific keys.
 */
export interface IPermissionsBuilder {
  fromKeys(keys: string[]): number
  byExclusion(keysToExclude: string[]): number
  fromRange(fromValue: number, toValue: number): number
}

/**
 * @name PermissionsBuilder
 * @description
 * Implements IPermissionsBuilder helper functions
 * that can build permissions values from specific keys,
 * from a range of values, or by exluding specific keys.
 * @implements {IPermissionsBuilder}
 * @param {IPermissionType} types - The permission types to use for building permissions.
 * @returns {IPermissionsBuilder} An instance of PermissionsBuilder.
 * @example
 * const permissionsBuilder = new PermissionsBuilder(permissionTypes);
 * const permissions = permissionsBuilder.fromKeys(['View', 'Add']);
 * const permissionsExcluding = permissionsBuilder.byExclusion(['Delete']);
 * const permissionsInRange = permissionsBuilder.fromRange(1, 3);
 * @see IPermissionType
 * @see IPermissionsBuilder
 * @see https://example.com/permissions-builder
 */
export class PermissionsBuilder implements IPermissionsBuilder {
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
    const types = this.types
    type keyType = keyof typeof types

    const keys: string[] = Object.getOwnPropertyNames(this.types).filter(
      (key) => keysToExclude.indexOf(key as keyType) === -1
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
