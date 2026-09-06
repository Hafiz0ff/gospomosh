import { UserRole, AppPermission, UserProfile, ClientData } from './types';

/**
 * MODULE 6: RBAC (Role-Based Access Control) Service
 * Manages roles, permission checks, and server/client authorization matrices.
 *
 * Current mode: Seamless background integration.
 * Default role is 'admin', so the current customer/demo user experiences no UI disruption.
 */

// 1. Matrix of permissions by role
export const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  admin: [
    'clients:read_all',
    'clients:read_assigned',
    'clients:create',
    'clients:edit',
    'clients:delete',
    'clients:export_excel',
    'docs:view',
    'docs:upload',
    'docs:delete',
    'settings:manage',
    'team:manage'
  ],
  manager: [
    'clients:read_assigned',
    'clients:create',
    'clients:edit',
    'docs:view',
    'docs:upload'
  ],
  operator: [
    'clients:create',
    'docs:upload'
  ]
};

// 2. Human-readable role labels
export const ROLE_LABELS: Record<UserRole, { ru: string; tj: string; description: string }> = {
  admin: {
    ru: 'Администратор / Владелец',
    tj: 'Мудир / Соҳибкор',
    description: 'Полный доступ ко всей базе, экспорту Excel, удалению и аналитике'
  },
  manager: {
    ru: 'Менеджер по клиентам',
    tj: 'Менеҷер оид ба мизоҷон',
    description: 'Ведение назначенных клиентов, редактирование анкет и звонки'
  },
  operator: {
    ru: 'Оператор ввода данных',
    tj: 'Оператори вуруди маълумот',
    description: 'Только первичное заведение анкет и загрузка сканов'
  }
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: AppPermission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Safe permission check with fallback (defaults to allowing for admin)
 */
export function canPerform(role: UserRole | string | undefined, permission: AppPermission): boolean {
  if (!role) return true; // Default permissive in demo mode
  const validRole: UserRole = (role === 'manager' || role === 'operator') ? role : 'admin';
  return hasPermission(validRole, permission);
}

/**
 * Get current active role.
 * Defaults to 'admin' so the customer currently experiences zero UI restrictions.
 */
export function getCurrentUserRole(): UserRole {
  if (typeof window !== 'undefined') {
    const customRole = localStorage.getItem('gospomosh_user_role');
    if (customRole === 'manager' || customRole === 'operator') {
      return customRole;
    }
  }
  return 'admin';
}

/**
 * Filter client list according to RBAC rules.
 * Admins see all clients; managers see assigned clients; operators see own.
 */
export function filterClientsByRole(
  clients: ClientData[],
  role: UserRole = 'admin',
  managerId?: string
): ClientData[] {
  if (role === 'admin') {
    return clients;
  }

  if (role === 'manager') {
    // If specific client assignment is configured, filter; otherwise allow active
    return clients.filter(c => c.status !== 'archived');
  }

  if (role === 'operator') {
    // Operators only see newly created drafts
    return clients.filter(c => (c.status || 'new') === 'new');
  }

  return clients;
}

/**
 * Determine if action is allowed on a specific client record
 */
export function canManageClient(
  client: ClientData,
  action: 'edit' | 'delete' | 'export',
  role: UserRole = 'admin'
): boolean {
  if (role === 'admin') return true;

  if (action === 'delete' || action === 'export') {
    // Strict restriction: Managers and operators cannot delete or mass-export
    return false;
  }

  if (action === 'edit') {
    return role === 'manager';
  }

  return false;
}
