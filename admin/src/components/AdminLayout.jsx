import React from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Sparkles, 
  Database, 
  History, 
  CreditCard, 
  Settings, 
  ChevronLeft,
  Bell,
  Search,
  LogOut
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: '仪表盘中心', icon: LayoutDashboard },
  { id: 'users', label: '用户与档案', icon: Users },
  { id: 'questions', label: '习题内容', icon: BookOpen },
  { id: 'ai', label: 'AI出题中心', icon: Sparkles },
  { id: 'knowledge', label: '题库与知识点', icon: Database },
  { id: 'records', label: '学习记录与错题', icon: History },
  { id: 'billing', label: '收费与积分', icon: CreditCard },
  { id: 'settings', label: '系统与权限', icon: Settings },
]

const AdminLayout = ({ children, activeMenu, onMenuChange, adminProfile, onLogout }) => {
  const [collapsed, setCollapsed] = React.useState(false)
  
  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <motion.div
        className="sidebar h-screen sticky top-0 flex flex-col"
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">题</span>
              </div>
              <span className="font-semibold text-neutral-800">题小助</span>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft size={20} className={`text-neutral-500 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id)}
                className={`sidebar-item w-full flex items-center gap-3 mb-1 ${
                  isActive ? 'active' : ''
                }`}
              >
                <Icon size={20} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            )
          })}
        </nav>
        
        {/* User */}
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">管</span>
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1"
              >
                <div className="text-sm font-medium text-neutral-800">{adminProfile?.displayName || '管理员'}</div>
                <div className="text-xs text-neutral-500">{adminProfile?.role === 'super_admin' ? '超级管理员' : '运营账号'}</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="input-admin pl-10 w-[300px]"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <Bell size={20} className="text-neutral-500" />
              </button>
              <button onClick={onLogout} className="btn-admin btn-admin-secondary flex items-center gap-2">
                <LogOut size={16} />
                <span>退出</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
