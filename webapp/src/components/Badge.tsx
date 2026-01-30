interface BadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
}

const colorConfig = {
  gray: 'bg-gray-100 text-gray-800',
  blue: 'bg-accent/15 text-accent',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-primary/10 text-primary/90',
  orange: 'bg-orange-100 text-orange-800'
};

export function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorConfig[color]}`}>
      {children}
    </span>
  );
}
