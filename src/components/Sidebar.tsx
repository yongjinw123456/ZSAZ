import { MonitorPlay, LayoutDashboard, FileText, Settings, ShieldCheck, Box, User, ChevronDown, ChevronRight, Bell, Calculator, Sliders, Coins, BarChart } from "lucide-react";
import { useState } from "react";

export function Sidebar({ activeMenu, onMenuClick }: { activeMenu: string, onMenuClick: (menu: string) => void }) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "集中服务费分摊管理": true,
    "结算管理": true,
    "服务中心": true
  });

  const toggleExpand = (menuName: string) => {
    setExpandedMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const allMenus = [
    { name: "数据一张图", icon: <LayoutDashboard className="w-4 h-4 text-amber-500" />, developed: true },
    { name: "保司数据统计概览", icon: <BarChart className="w-4 h-4 text-blue-500" />, developed: true },
    { name: "服务成果", icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, developed: true },
    { name: "服务标准配置", icon: <Sliders className="w-4 h-4 text-indigo-600" />, developed: true },
    { name: "事故预防服务费管理", icon: <Coins className="w-4 h-4 text-amber-600" />, developed: true },
    {
      name: "服务中心",
      icon: <User className="w-4 h-4 text-purple-600" />,
      developed: true,
      children: [
        { name: "服务评价", developed: true },
        { name: "投诉建议", developed: true }
      ]
    },
    { 
      name: "保费试算工具", 
      icon: <Calculator className="w-4 h-4" />, 
      developed: true,
      children: [
        { name: "保费试算 (Web端)", developed: true },
        { name: "保费试算 (H5)", developed: true },
      ]
    },
    { 
      name: "预警提醒中心", 
      icon: <Bell className="w-4 h-4" />, 
      developed: true 
    },
    { 
      name: "集中服务费分摊管理", 
      icon: <LayoutDashboard className="w-4 h-4" />, 
      developed: true,
      children: [
        { name: "分摊规则配置", developed: true },
        { name: "月度分摊计算", developed: false },
        { name: "分摊台账", developed: false },
        { name: "分摊统计", developed: false },
      ]
    },
    { 
      name: "结算管理", 
      icon: <Box className="w-4 h-4" />, 
      developed: true,
      children: [
        { name: "结算单生成", developed: true },
        { name: "对账管理", developed: true },
        { name: "支付管理", developed: true },
        { name: "结算档案", developed: true },
      ]
    },
    { name: "服务回访管理", icon: <Settings className="w-4 h-4" />, developed: true },
  ];

  const menus = allMenus.filter(m => m.developed);

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full flex flex-col overflow-y-auto shrink-0 select-none">
      <div className="flex-1 py-4">
        {menus.map((menu, idx) => {
          const isExpanded = expandedMenus[menu.name];
          const isActive = activeMenu === menu.name;
          const hasChildren = menu.children && menu.children.length > 0;

          return (
            <div key={idx}>
              <div
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(menu.name);
                  } else {
                    onMenuClick(menu.name);
                  }
                }}
                className={`flex items-center justify-between px-6 py-3 cursor-pointer text-sm transition-colors ${
                  isActive && !hasChildren
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  {menu.icon}
                  <span className={hasChildren ? "font-medium text-gray-800" : ""}>{menu.name}</span>
                </div>
                {hasChildren && (
                  isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                )}
              </div>
              
              {/* Render Sub Menus */}
              {hasChildren && isExpanded && (
                <div className="mb-2 bg-gray-50/50">
                  {menu.children!.map((sub, sidx) => {
                    if (!sub.developed) return null;
                    const isSubActive = activeMenu === sub.name;
                    return (
                      <div
                        key={sidx}
                        onClick={() => onMenuClick(sub.name)}
                        className={`flex items-center pl-10 pr-6 py-2.5 cursor-pointer text-sm transition-colors ${
                          isSubActive
                            ? "text-blue-600 font-medium relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-blue-600"
                            : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                        }`}
                      >
                        {sub.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
