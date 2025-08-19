import { ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"

interface TrickItemProps {
  trick: {
    detail: string
    variant: TrickItemProps['trick'][]
  }
  level?: number
}

export function TrickItem({ trick, level = 0 }: TrickItemProps) {
  const hasVariants = trick.variant && trick.variant.length > 0
  const [isExpanded, setIsExpanded] = useState(false) // Todas las variantes cerradas por defecto
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="w-full">
      <div 
        className={`p-3 rounded-lg mb-2 bg-[#1e293b] border border-gray-700 ${hasVariants ? 'cursor-pointer' : ''}`}
        style={{ marginLeft: `${level * 1}rem` }}
        onClick={hasVariants ? toggleExpand : undefined}
      >
        <div className="flex items-start gap-2">
          {hasVariants ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0 transition-transform" />
            )
          ) : (
            <div className="w-4 h-4 mt-1 flex-shrink-0" />
          )}
          <span className="text-sm leading-relaxed">{trick.detail}</span>
        </div>
      </div>

      {hasVariants && isExpanded && (
        <div className="pl-4 border-l-2 border-gray-600 animate-in slide-in-from-top duration-200">
          {trick.variant.map((variant, index) => (
            <TrickItem 
              key={index} 
              trick={variant} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
