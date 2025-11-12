import { cn } from '@/lib/utils';
import { Container, User } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface Props{
    className?: string;
}


export const Header: React.FC<Props> = ({className}) => {
    return(
        <header className={cn('border border-b', className)}>
            <div className='flex items-center justify-between py-8'>
                <div className="flex items-center gap-4">
                    {/* Left chast */}
                    <img src ="logo.png" alt ="Logo" width={35} height={35}/>
                    <div>
                        <h1 className="text-2xl uppercase font-black">Cup & Crumble</h1>
                        <p className="text-sm text gray-400 leading-3">some text</p>
                    </div>
                </div>

                {/* Right chast */}

                <div className="flex items-center gap-3">
                    <Button variant = "outline" className="flex items-center gap-1">
                        <User size={16}/>
                        Войти
                    </Button>
                </div>
                <div>

                </div>
            </div>

        </header>
    )
}