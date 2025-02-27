# @builtwithjavascript/permissions

```
import { IPermissionType, PermissionType, Permissions } from '@builtwithjavascript/permissions'

/*
	In your application, you will be extending the IPermissionType with 
	additional custom permission types. You will create an interface that
	defines the new types, i.e. YourAppIPermissionType
	as in the code below
*/

/**
 * @name YourAppIPermissionType
 * @description
 * You will extend the IPermissionType with additional definitions
 */
export interface YourAppIPermissionType extends IPermissionType {
  readonly Publish: number
  readonly Share: number
}

/**
 * @name YourAppPermissionType
 * @description
 * You will extend the current PermissionType instance as well.
 * We have to pass an array with the name of the new definitions because in
 * TS there is not an easy way to programmatically get properties from an interface.
 * Just remember that these have ot match the property names in your interface (in this case Publish and Share)
 */
export const YourAppPermissionType: YourAppIPermissionType = Permissions.extendTypes([
  'Publish',
  'Share',
]) as YourAppIPermissionType


```