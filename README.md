# @builtwithjavascript/permissions

A lightweight TypeScript utility for managing and evaluating permissions in web applications. Designed with extensibility and composability in mind.

---



## 🚀 Installation

```bash
npm install @builtwithjavascript/permissions
```



## 🧠 Core Concepts

 - **Permission**: A rule describing access to a resource and action (optionally with a condition). 
 - **PermissionsBuilder**: A utility to register and evaluate sets of permissions.
 - **Security**: A wrapper to centralize permission checks in an application.



## ✨ Usage

1. **Define Your Own Permissions**
Extend the base permission interface to define additional app-specific permissions:
```typescript
import { Permission, PermissionsBuilder } from '@builtwithjavascript/permissions'

export interface YourAppPermission extends Permission {
  readonly Publish?: boolean
  readonly Share?: boolean
}
```

2. **Add Permissions**
```typescript
const builder = new PermissionsBuilder()
builder.add(
  { resource: 'article', action: 'edit' },
  { resource: 'article', action: 'publish', condition: (ctx) => ctx?.isAdmin }
)
```

3. **Check Access**
```typescript
import { Security } from '@builtwithjavascript/permissions'

const security = new Security(builder)

const canPublish = security.isAllowed(
  { resource: 'article', action: 'publish' },
  { isAdmin: true } // context
)

console.log(canPublish) // true or false
```



## 🧪 Example: Extending Permission Types

```typescript
import { IPermissionType, Permissions } from '@builtwithjavascript/permissions'

/**
 * Extend IPermissionType with custom types
 */
export interface YourAppIPermissionType extends IPermissionType {
  readonly Publish: number
  readonly Share: number
}

/**
 * Extend PermissionType with names matching your custom interface
 */
export const YourAppPermissionType: YourAppIPermissionType = Permissions.extendTypes([
  'Publish',
  'Share',
]) as YourAppIPermissionType
```



## 📚 API Overview

### Permissions
```typescript
interface Permission {
  resource: string
  action: string
  condition?: string | ((context?: any) => boolean)
}
```

### PermissionsBuilder

- `add(...permissions: Permission[]): this`
   Adds one or more permissions.
- `allows(permission: Permission, context?: any): boolean`
   Checks if permission is granted.
- `list(): Permission[]`
   Returns all stored permissions.

### Security

- `isAllowed(permission: Permission, context?: any): boolean`
   Delegates permission check to `PermissionsBuilder`.

  

## 📦 Project Structure

```
src/
  ├── permissions/
  │     ├── permission-type.ts
  │     ├── permissions.ts
  │     ├── permissions-builder.ts
  ├── security/
  │     └── security.ts
  └── index.ts
```

