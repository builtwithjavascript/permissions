# @builtwithjavascript/permissions

A lightweight TypeScript utility for managing and evaluating permissions in web applications. Designed with extensibility and composability in mind, this library helps you define, add, and check access permissions efficiently.



---



## 🚀 Installation

```bash
npm install @builtwithjavascript/permissions
```



## 🧠 Core Concepts

- **PermissionType**: A set of predefined numerical values (powers of 2) representing different types of actions (e.g., View, Add, Update, Delete). These can be extended with custom types.
- **PermissionBuilder**: A utility to create permission values by combining `PermissionType` values, either by specifying keys, excluding keys, or within a range.
- **Permissions**: A static class providing methods to check if a specific permission is granted and to extend the default `PermissionType` with custom types.
- **Security**: (Optional) A wrapper to centralize and manage user/role-based permission checks within an application.



## ✨ Usage

**Define and Extend Permission Types**
The library provides a default `PermissionType`. You can extend this with your application-specific permissions using `Permissions.extendTypes()`.

```typescript
import { IPermissionType, PermissionType, Permissions } from '@builtwithjavascript/permissions';

/**
 * Extend IPermissionType with custom types
 */
export interface YourAppIPermissionType extends IPermissionType {
  readonly Publish: number;
  readonly Share: number;
}

/**
 * Extend PermissionType with names matching your custom interface
 */
export const YourAppPermissionType: YourAppIPermissionType = Permissions.extendTypes(
  PermissionType, // Use the base PermissionType
  ['Publish', 'Share']
) as YourAppIPermissionType;

console.log(YourAppPermissionType.Publish); // Will log a power of 2, e.g., 16
console.log(YourAppPermissionType.Share);   // Will log a power of 2, e.g., 32
```



**Build Permissions**

Use `PermissionBuilder` to combine `PermissionType` values into a single numerical permission value for a given resource or domain.

```typescript
import { PermissionBuilder, PermissionType } from '@builtwithjavascript/permissions';
import { YourAppPermissionType } from './your-app-permission-type'; // Assuming you saved the extended type

const builder = new PermissionBuilder(PermissionType); // For default types
const yourAppBuilder = new PermissionBuilder(YourAppPermissionType); // For your extended types

// Build permissions using default types
const itemPermissions = builder.fromKeys(['View', 'Add']);
console.log(`Item Permissions (View, Add): ${itemPermissions}`); // e.g., 3 (1 | 2)

// Build permissions by exclusion
const allExceptDelete = builder.byExclusion(['Delete']);
console.log(`All Except Delete: ${allExceptDelete}`); // e.g., 7 (1 | 2 | 4)

// Build permissions using your extended types
const articlePublishAndShare = yourAppBuilder.fromKeys(['Publish', 'Share']);
console.log(`Article Publish & Share Permissions: ${articlePublishAndShare}`); // e.g., 48 (16 | 32)
```



**Check Access**

The `Security` class allows you to set permission information for users/roles and then check if they have specific access.

```typescript
import { Security, PermissionType } from '@builtwithjavascript/permissions';
import { YourAppPermissionType } from './your-app-permission-type'; // Assuming you saved the extended type

const security = new Security();

// Set permissions for a user
security.setPermissionInfo({
  id: 'user123',
  permissions: {
    'Articles': new PermissionBuilder(YourAppPermissionType).fromKeys(['View', 'Publish']),
    'Comments': new PermissionBuilder(PermissionType).fromKeys(['View', 'Add'])
  }
});

// Check if user123 can view articles
const canViewArticles = security.hasPermissions({
  id: 'user123',
  domain: 'Articles',
  permissionType: YourAppPermissionType.View
});
console.log(`Can user123 view articles? ${canViewArticles}`); // true

// Check if user123 can publish articles
const canPublishArticles = security.hasPermissions({
  id: 'user123',
  domain: 'Articles',
  permissionType: YourAppPermissionType.Publish
});
console.log(`Can user123 publish articles? ${canPublishArticles}`); // true

// Check if user123 can delete articles (they don't have this permission)
const canDeleteArticles = security.hasPermissions({
  id: 'user123',
  domain: 'Articles',
  permissionType: YourAppPermissionType.Delete
});
console.log(`Can user123 delete articles? ${canDeleteArticles}`); // false

// Check if user123 can add comments
const canAddComments = security.hasPermissions({
  id: 'user123',
  domain: 'Comments',
  permissionType: PermissionType.Add
});
console.log(`Can user123 add comments? ${canAddComments}`); // true
```





## 📚 API Overview

### IPermissionType

```typescript
interface IPermissionType extends Record<string, number> {
  View: number;
  Add: number;
  Update: number;
  Delete: number;
  // ... can be extended with more custom number-based permissions
}
```

A base interface defining numerical permission types. Values are powers of 2 for efficient bitwise operations.



### PermissionType

```typescript
export const PermissionType: IPermissionType = {
  View: 1,
  Add: 2,
  Update: 4,
  Delete: 8
};
```

The default implementation of `IPermissionType`.



### Permissions (Static Class)

Provides static methods for permission checking and type extension.

- `static hasPermission(permissionType: number, permissions: number): boolean` Checks if a specific `permissionType` is included in a given `permissions` value.
- `static extendTypes(permissionTypes: IPermissionType, names: string[]): IPermissionType` Extends an existing `IPermissionType` object with new permission names, assigning them appropriate power-of-2 values.



### PermissionBuilder

```typescript
class PermissionBuilder implements IPermissionBuilder {
  constructor(types: IPermissionType);
  fromKeys(keys: string[]): number;
  byExclusion(keysToExclude: string[]): number;
  fromRange(fromValue: number, toValue: number): number;
}
```

A class to construct combined permission values based on `IPermissionType`.

- `constructor(types: IPermissionType)`: Initializes the builder with a set of permission types.
- `fromKeys(keys: string[]): number`: Generates a permission value by combining the values of specified keys.
- `byExclusion(keysToExclude: string[]): number`: Generates a permission value by combining all types *except* those specified in `keysToExclude`.
- `fromRange(fromValue: number, toValue: number): number`: Generates a permission value by combining types whose numerical value falls within a given range.



### Security (optional)

```typescript
interface IPermissionInfo {
  id: string;
  permissions: { [key: string]: number }; // Maps domain names to their permission values
}

class Security implements ISecurity {
  constructor();
  setPermissionInfo(params: IPermissionInfo): void;
  hasPermissions(params: { id: string; domain: string; permissionType: number }): boolean;
}
```

A service for managing and checking user/role permissions across different domains.

- `constructor()`: Initializes the Security service.
- `setPermissionInfo(params: IPermissionInfo)`: Stores permission information for a given `id` (e.g., user ID, role ID) and their associated domain permissions.
- `hasPermissions(params: { id: string; domain: string; permissionType: number }): boolean`: Checks if the specified `id` has the `permissionType` for the given `domain`.

  

## 📦 Project Structure

```
src/
  ├── permissions/
  │     ├── permission-type.ts        # Defines IPermissionType and PermissionType
  │     ├── permissions.ts            # Implements Permissions static class (hasPermission, extendTypes)
  │     ├── permissions-builder.ts    # Implements PermissionBuilder
  ├── security/
  │     └── security.ts               # Implements Security class
  └── index.ts                        # Main export file
```

