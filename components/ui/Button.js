'use client';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
    const base = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-400 shadow-lg hover:shadow-xl',
        secondary: 'bg-white text-red-600 border-2 border-red-500 hover:bg-red-50 focus:ring-red-300',
        ghost: 'bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-200',
        orange: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 focus:ring-orange-300 shadow-lg hover:shadow-xl',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
