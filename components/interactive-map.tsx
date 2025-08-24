'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface GrievanceData {
  id: string
  category: string
  status: string
  priority: string
  location: string
  coordinates?: [number, number]
  created_at: string
  ward_number?: string
}

interface InteractiveMapProps {
  grievances: GrievanceData[]
  categories: any[]
}

const categoryColors = {
  garbage: '#ef4444',
  water_supply: '#3b82f6',
  drainage: '#8b5cf6',
  street_lights: '#f59e0b',
  roads: '#10b981',
  sewage: '#d946ef',
  noise_pollution: '#f97316',
  illegal_construction: '#dc2626',
  property_tax: '#059669',
  other: '#6b7280'
}

// Custom marker icons
const createCustomIcon = (color: string, priority: string) => {
  const size = priority === 'urgent' ? 25 : priority === 'high' ? 20 : 15
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${priority === 'urgent' ? '!' : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  })
}

export default function InteractiveMap({ grievances, categories }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map centered on Bhopal
    const map = L.map(mapRef.current).setView([23.2599, 77.4126], 12)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    // Add markers for grievances
    grievances.forEach((grievance) => {
      if (grievance.coordinates) {
        const color = categoryColors[grievance.category as keyof typeof categoryColors] || '#6b7280'
        const icon = createCustomIcon(color, grievance.priority)
        
        const marker = L.marker(grievance.coordinates, { icon }).addTo(map)
        
        const categoryLabel = categories.find(cat => cat.value === grievance.category)?.label || grievance.category
        
        marker.bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: ${color};">
              ${categoryLabel}
            </h3>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${grievance.location}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> 
              <span style="
                padding: 2px 6px; 
                background-color: ${color}; 
                color: white; 
                border-radius: 4px; 
                font-size: 12px;
              ">
                ${grievance.status.replace('_', ' ').toUpperCase()}
              </span>
            </p>
            <p style="margin: 4px 0;"><strong>Priority:</strong> ${grievance.priority.toUpperCase()}</p>
            ${grievance.ward_number ? `<p style="margin: 4px 0;"><strong>Ward:</strong> ${grievance.ward_number}</p>` : ''}
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
              ${new Date(grievance.created_at).toLocaleDateString()}
            </p>
          </div>
        `)
      }
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [grievances, categories])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  )
}
