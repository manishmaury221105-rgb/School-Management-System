import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  accentColor = '#4f46e5',
  lightBg = '#e0e7ff',
  subText
}) => {
  return (
    <div
      className="stat-card"
      style={{
        '--card-accent': accentColor,
        '--icon-bg': lightBg,
        '--icon-color': accentColor,
      }}
    >
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {(trend || subText) && (
          <div className="stat-trend" style={{ color: trendPositive ? '#10b981' : '#f43f5e' }}>
            {trend && (
              <>
                {trendPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                <span>{trend}</span>
              </>
            )}
            {subText && (
              <span style={{ color: 'var(--text-muted)', fontWeight: '500', marginLeft: trend ? '4px' : '0' }}>
                {subText}
              </span>
            )}
          </div>
        )}
      </div>
      {Icon && (
        <div className="stat-icon-wrap">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
