import { describe, it, expect } from 'vitest'
import { PermissionType, PermissionsBuilder } from '@/permissions'

describe('PermissionsBuilder (of PermissionType)', () => {
  const builder = new PermissionsBuilder(PermissionType)

  describe('fromKeys', () => {
    it('should return expected value when includes [View, Add] only ', () => {
      const permissions = builder.fromKeys(['View', 'Add'])
      const expected = PermissionType.View | PermissionType.Add
      expect(permissions).to.equal(expected)
    })
  })

  describe('byExclusion', () => {
    it('should return expected value when excludes [Update, Delete]', () => {
      const permissions = builder.byExclusion(['Update', 'Delete'])
      const expected = PermissionType.View | PermissionType.Add
      expect(permissions).to.equal(expected)
    })
  })

  describe('byExclusion: only Delete', () => {
    it('should return expected value when excludes [Delete]', () => {
      const permissions = builder.byExclusion(['Delete'])
      const expected = PermissionType.View | PermissionType.Add | PermissionType.Update
      expect(permissions).to.equal(expected)
    })
  })

  describe('fromRange', () => {
    it('should return expected value when includes from View to Delete', () => {
      const permissions = builder.fromRange(PermissionType.View, PermissionType.Update)
      const expected = PermissionType.View | PermissionType.Add | PermissionType.Update
      expect(permissions).to.equal(expected)
    })
  })
})
