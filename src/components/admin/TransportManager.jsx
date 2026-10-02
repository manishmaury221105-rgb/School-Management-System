import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Bus, MapPin, Phone, User, Users, Clock, Plus } from 'lucide-react';

export const TransportManager = () => {
  const { transportRoutes } = useSchoolData();

  return (
    <div className="animate-fade-in">
      <div className="page-header-wrap">
        <div>
          <h1 className="page-title">School Bus & Transport Logistics</h1>
          <p className="page-subtitle">
            Manage designated bus routes, driver credentials, vehicle capacity & student stop schedules.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {transportRoutes.map((route) => {
          const fillRatio = Math.round((route.studentCount / route.capacity) * 100);
          return (
            <div
              key={route.id}
              className="card-elevated"
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Bus size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{route.routeName}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Vehicle: {route.vehicleNumber}
                      </span>
                    </div>
                  </div>
                  <span className="badge-status badge-active">Active Route</span>
                </div>

                {/* Driver Info Card */}
                <div style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Designated Driver:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{route.driverName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: '700' }}>
                    <span>Emergency Contact:</span>
                    <span>{route.driverPhone}</span>
                  </div>
                </div>

                {/* Capacity Meter */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Bus Seat Occupancy</span>
                    <span>{route.studentCount} / {route.capacity} Students ({fillRatio}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${fillRatio}%`,
                        height: '100%',
                        background: fillRatio >= 90 ? '#ef4444' : 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                {/* Stops Timeline */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Scheduled Stops & Timings:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {route.stops.map((stop, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.4rem 0.65rem',
                          background: 'var(--bg-card)',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '0.8rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={13} color="var(--primary)" />
                          <span style={{ fontWeight: '600' }}>{stop.name}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          Pickup: {stop.pickupTime} • Drop: {stop.dropTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
