import {PlusIcon} from "@heroicons/react/24/outline";
import {ComponentProps} from "react";

type Props = ComponentProps<'button'> & {
    text?: string;
};

export const SubmitButton = ({ text = "Сохранить", ...props}: Props) => (
    <button type="submit"
            {...props}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors">
        <PlusIcon className="w-5 h-5 mr-2"/>
        {text}
    </button>
);
