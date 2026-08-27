import React from 'react';
import { StreamChartDataPoint, PopularTitleStats } from '../../services/adminService';

interface AnalyticsChartsProps {
  trafficData: StreamChartDataPoint[];
  popularTitles: PopularTitleStats[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  trafficData,
  popularTitles
}) => {
  const maxViews = Math.max(...trafficData.map(d => d.views));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stream Traffic & Watch Time Chart */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-[#12121B] border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">Weekly Stream Views & Engagement</h3>
            <p className="text-xs text-text-muted">Total stream sessions across mobile, TV, and web</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-brand-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <span>Views</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-amber">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
              <span>Watch Hours</span>
            </div>
          </div>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="pt-4 h-64 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
          {trafficData.map((d, i) => {
            const heightPercent = Math.round((d.views / maxViews) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div className="text-[10px] text-brand-amber font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity">
                  {Math.round(d.views / 1000)}k
                </div>
                <div className="w-full max-w-[36px] bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end h-44">
                  <div
                    className="w-full bg-gradient-to-t from-brand-primary to-brand-amber rounded-t-md transition-all duration-500 group-hover/bar:brightness-125"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-secondary">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Streamed Titles Table */}
      <div className="p-6 rounded-2xl bg-[#12121B] border border-white/10 shadow-lg space-y-4">
        <div>
          <h3 className="font-display font-bold text-white text-base">Most Watched Titles</h3>
          <p className="text-xs text-text-muted">Ranked by total hours completed</p>
        </div>

        <div className="space-y-3 pt-2">
          {popularTitles.map((title, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white truncate max-w-[160px]">{title.title}</span>
                <span className="text-brand-amber font-mono">{(title.views / 1000).toFixed(0)}k streams</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-cyan rounded-full"
                  style={{ width: `${title.completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-text-muted">
                <span>Rating: {title.rating} ★</span>
                <span>{title.completionRate}% completion</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
