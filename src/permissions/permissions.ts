import { IPermissionType } from './permission-type'

/**
 * @name IPermissionStatic
 * @description
 * TypeScript trick to declare methods
 * for static classes through interface.
 * This allows us to define
 * static methods on the Permissions class
 * while still adhering to the interface.
 * @see IPermissionType
 * @see PermissionType
 */
export interface IPermissionStatic {
  hasPermission(permissionType: number, permissions: number): boolean
  extendTypes(permissionTypes: IPermissionType, names: string[]): IPermissionType
}

export interface IPermissions {}

/**
 * @name Permissions
 * @description
 * Export our static Permissions instance.
 * This class implements the IPermissions interface
 * and provides methods to check permissions
 * and extend permission types dynamically.
 * @implements {IPermissions}
 * @see IPermissionStatic
 * @see IPermissionType
 * @see PermissionType
 * @example
 * const hasViewPermission = Permissions.hasPermission(PermissionType.View, userPermissions);
 * const extendedPermissions = Permissions.extendTypes(['CustomPermission1', 'CustomPermission2']);
 */
export const Permissions: IPermissionStatic = class implements IPermissions {
  public static hasPermission(permissionType: number, permissions: number): boolean {
    return permissionType === (permissions & permissionType)
  }

  /**
   * @name extendTypes
   * @description
   * Extends IPermissionType with additional properties with the correct values.
   * This method allows you to add new permission types dynamically.
   * It calculates the values for the new permission types based on the existing ones.
   * The values are assigned as powers of 2, ensuring that they do not conflict with
   * existing permission types.
   * @implements {IPermissionStatic}
   * @returns {IPermissionType} A new IPermissionType object with the additional permission types added.
   * @example
   * const extendedPermissions = Permissions.extendTypes(['CustomPermission1', 'CustomPermission2']);
   * // Now extendedPermissions will include CustomPermission1 and CustomPermission2
   * // with values assigned as powers of 2 based on the existing PermissionType.
   * @see IPermissionType
   * @see PermissionType
   * @param {string[]} names - The names of the new permission types to add.
   * @returns {IPermissionType} A new IPermissionType object with the additional permission types added.
   * @throws {Error} If the names array is empty or contains invalid names.
   */
  public static extendTypes(permissionTypes: IPermissionType, names: string[]): IPermissionType {
    // create an empty dictionary where to add additional custom permissions
    const additionalPermissions: { [key: string]: number } = {}

    // get keys
    const keys: string[] = Object.keys(permissionTypes)
    // check if base zero
    const firstValue = permissionTypes[keys[0]]

    let factor = keys.length
    if (firstValue === 0) {
      factor -= 1
    }

    // assign values to each new permission type
    names.forEach((name) => [
      // double previous value
      (additionalPermissions[name] = Math.pow(2, factor++))
    ])

    // create union of both current permissionTypes and the additionalPermissions
    const unionPermissionType: IPermissionType = Object.freeze({
      ...permissionTypes,
      ...additionalPermissions
    } as IPermissionType)

    return unionPermissionType
  }
}
