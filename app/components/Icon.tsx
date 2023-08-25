'use client';

import { FC } from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';

export type IconType = keyof typeof PhosphorIcons;

interface IconComponentProps extends PhosphorIcons.IconProps {
    icon: IconType;
    className?: string;
}

const Icon: FC<IconComponentProps> = ({ icon, size = 16, weight, className }) => {
    if (!icon) return null;

    const IconComponent = PhosphorIcons[icon] as FC<PhosphorIcons.IconProps>;
    return <IconComponent size={size} className={className} weight={weight} />;
};

export default Icon;