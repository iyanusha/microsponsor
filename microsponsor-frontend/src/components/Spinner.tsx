interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const Spinner = ({ size = 'md', color = 'border-indigo-600' }: SpinnerProps) => (
  <div className="flex justify-center items-center">
    <div
      className={`animate-spin rounded-full border-b-2 ${sizeMap[size]} ${color}`}
    />
  </div>
);

export default Spinner;
