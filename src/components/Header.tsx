import { Monitor, User, LogOut, Bell } from "lucide-react";

export function Header({ onWarningClick, warningCount = 0 }: { onWarningClick?: () => void, warningCount?: number }) {
  return (
    <header className="h-14 bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="font-bold text-lg tracking-wide flex items-center gap-2">
          扬州安责险服务管理平台运营端
          <span className="text-sm font-normal opacity-80 ml-2 relative top-[1px]">
            中银保险有限公司扬州中心支公司
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <button 
          onClick={onWarningClick}
          className="relative flex items-center justify-center hover:opacity-80 transition-opacity p-1"
        >
          <Bell className="w-5 h-5" />
          {warningCount > 0 && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full transform translate-x-1/4 -translate-y-1/4 border-2 border-blue-600">
              {warningCount}
            </div>
          )}
        </button>
        <a href="#" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <Monitor className="w-4 h-4" />
          数据大屏
        </a>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span>欢迎您，王强</span>
          </div>
          <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </div>
    </header>
  );
}
