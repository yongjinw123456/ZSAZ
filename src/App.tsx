import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ServiceVisitList } from './components/ServiceVisitList';
import { ServiceVisitDetail } from './components/ServiceVisitDetail';
import { DataOneChart } from './components/DataOneChart';
import { CarrierDataStatistics } from './components/CarrierDataStatistics';
import { ApportionmentRuleConfig } from './components/ApportionmentRuleConfig';
import { WarningReminderCenter } from './components/WarningReminderCenter';
import { SettlementOrderGenerate } from './components/SettlementOrderGenerate';
import { SettlementReconciliation } from './components/SettlementReconciliation';
import { SettlementPayment } from './components/SettlementPayment';
import { SettlementArchive } from './components/SettlementArchive';
import { PremiumCalculatorH5 } from './components/PremiumCalculatorH5';
import { PremiumCalculatorWeb } from './components/PremiumCalculatorWeb';
import { ServiceResults } from './components/ServiceResults';
import { ServiceStandardConfig } from './components/ServiceStandardConfig';
import { ServiceFeedback } from './components/ServiceFeedback';
import { ServiceFeeManagement } from './components/ServiceFeeManagement';
import { ServiceVisitRecord } from './types';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('数据一张图');
  const [activeRecord, setActiveRecord] = useState<ServiceVisitRecord | null>(null);
  const [warningCount, setWarningCount] = useState(25);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 font-sans text-gray-900 selection:bg-blue-100">
      <Header onWarningClick={() => {
        setActiveMenu('预警提醒中心');
        setActiveRecord(null);
      }} warningCount={warningCount} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeMenu={activeMenu} onMenuClick={(menu) => {
          setActiveMenu(menu);
          setActiveRecord(null);
        }} />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#eff3f8]">
          {activeMenu === '数据一张图' && (
            <DataOneChart />
          )}

          {activeMenu === '保司数据统计概览' && (
            <CarrierDataStatistics />
          )}

          {activeMenu === '服务成果' && (
            <ServiceResults />
          )}

          {activeMenu === '服务标准配置' && (
            <ServiceStandardConfig />
          )}

          {activeMenu === '事故预防服务费管理' && (
            <ServiceFeeManagement />
          )}
          
          {activeMenu === '预警提醒中心' && (
            <WarningReminderCenter />
          )}

          {activeMenu === '服务评价' && (
            <ServiceFeedback initialSubMenu="evaluation" />
          )}

          {activeMenu === '投诉建议' && (
            <ServiceFeedback initialSubMenu="complaint" />
          )}

          {activeMenu === '分摊规则配置' && (
            <ApportionmentRuleConfig />
          )}
          
          {activeMenu === '结算单生成' && (
            <SettlementOrderGenerate />
          )}

          {activeMenu === '对账管理' && (
            <SettlementReconciliation />
          )}

          {activeMenu === '支付管理' && (
            <SettlementPayment />
          )}

          {activeMenu === '结算档案' && (
            <SettlementArchive />
          )}

          {activeMenu === '保费试算 (Web端)' && (
            <div className="h-full flex flex-col w-full bg-white relative">
               <PremiumCalculatorWeb />
            </div>
          )}

          {activeMenu === '保费试算 (H5)' && (
            <div className="h-full flex flex-col w-full bg-white relative">
               <PremiumCalculatorH5 />
            </div>
          )}

          {activeMenu === '服务回访管理' && (
            activeRecord ? (
              <ServiceVisitDetail 
                record={activeRecord} 
                onBack={() => setActiveRecord(null)} 
              />
            ) : (
                <ServiceVisitList onViewDetail={(record) => setActiveRecord(record)} />
            )
          )}
          
          {activeMenu !== '数据一张图' &&
           activeMenu !== '保司数据统计概览' && 
           activeMenu !== '服务成果' &&
           activeMenu !== '服务标准配置' &&
           activeMenu !== '事故预防服务费管理' &&
           activeMenu !== '服务回访管理' && 
           activeMenu !== '分摊规则配置' && 
           activeMenu !== '预警提醒中心' && 
           activeMenu !== '结算单生成' && 
           activeMenu !== '对账管理' && 
           activeMenu !== '支付管理' && 
           activeMenu !== '结算档案' && 
           activeMenu !== '保费试算 (Web端)' && 
           activeMenu !== '保费试算 (H5)' && 
           activeMenu !== '服务评价' && 
           activeMenu !== '投诉建议' && (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-400">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-lg font-medium">{activeMenu} 模块开发中...</p>
              <p className="text-sm">该功能正在完善中</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
