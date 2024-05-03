'use client';
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarProps {
    user?: User;
};

const AvatarComp: React.FC<AvatarProps> = ({ user }) => {

    return (
        <div className="relative shrink-0">
            <div className="relative shrink-0 inline-block overflow-hidden h-9 w-9 md:size-12 rounded-xl">
                <Image
                    fill
                    src={user?.image || '/placeholder.jpg'}
                    alt="Avatar"
                    className="object-cover"
                />
            </div>
        </div>
    );
}

export default AvatarComp;