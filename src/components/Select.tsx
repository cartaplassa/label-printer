import cn from '@/cn';

interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
    options?: string[];
    setValue: (v: any) => void;
}

function Select({ className, options, setValue, ...rest }: SelectProps) {
    return (
        <select
            className={cn(className)}
            onChange={(e) => setValue(e.target.value)}
            {...rest}
        >
            {options?.map((option) => (
                <option key={crypto.randomUUID()} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default Select;
