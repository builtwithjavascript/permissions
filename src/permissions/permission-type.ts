/**
 * @name IPermissionType
 * @description
 * Permission Types interface.
 * This interface defines the basic permission types
 * that can be used in the application.
 * By default, it includes View, Add, Update, and Delete permissions,
 * each represented by a unique number.
 * The values are powers of 2, allowing for bitwise operations
 * to combine permissions efficiently.
 * @interface IPermissionType
 */
export interface IPermissionType extends Record<string, number> {
  View: number
  Add: number
  Update: number
  Delete: number
}

/**
 * @name PermissionType
 * @description
 * Permission Types constants.
 * This contains the default View, Add, Update, and Delete.
 * You can then extend this by creating a new interface (i.e. YourAppIPermissionType)
 * that extends IPermissionType
 * and implements the additional permissions you need.
 * You can also extend the PermissionType
 * with Permissions.extendTypes (see yourapp/YourAppPermissionType.ts for sample code)
 * @constant {IPermissionType}
 * @type {IPermissionType}
 * @see IPermissionType
 */
export const PermissionType: IPermissionType = {
  View: 1,
  Add: 2,
  Update: 4,
  Delete: 8
}
