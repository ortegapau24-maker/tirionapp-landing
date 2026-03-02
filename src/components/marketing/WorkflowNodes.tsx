import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Common flat styling constants
const NODE_CLASSES = "bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_rgba(0,0,0,1)] p-4 flex flex-col gap-2 min-w-[220px]";
const HANDLE_CLASSES = "w-3 h-3 bg-black border-2 border-white";

interface CustomNodeData {
    label: string;
    sublabel: string;
    icon?: React.ReactNode;
    branchA?: string;
    branchB?: string;
}

interface CustomNodeProps {
    data: CustomNodeData;
}

export const TriggerNode = ({ data }: CustomNodeProps) => {
    return (
        <div className={NODE_CLASSES}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-black">
                    {data.icon || (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    )}
                </div>
                <span className="font-outfit font-bold text-black text-[0.9rem]">{data.label}</span>
            </div>
            <p className="text-gray-500 text-xs font-inter m-0">{data.sublabel}</p>
            <Handle type="source" position={Position.Bottom} className={HANDLE_CLASSES} />
        </div>
    );
};

export const AiClassifierNode = ({ data }: CustomNodeProps) => {
    return (
        <div className={NODE_CLASSES}>
            <Handle type="target" position={Position.Top} className={HANDLE_CLASSES} />
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <span className="font-outfit font-bold text-black text-[0.9rem] flex-1">{data.label}</span>
                <span className="bg-gray-100 text-[0.6rem] font-bold px-1.5 py-0.5 rounded border border-gray-200">GPT-4o</span>
            </div>
            <p className="text-gray-500 text-xs font-inter m-0">{data.sublabel}</p>

            <div className="flex justify-between mt-1 pt-1 border-t border-gray-100 text-[0.6rem] font-bold tracking-wide">
                <span className="text-red-500 uppercase">{data.branchA || "Urgent"}</span>
                <span className="text-gray-400 uppercase">{data.branchB || "Normal"}</span>
            </div>
            <Handle type="source" position={Position.Bottom} id="left" style={{ left: '25%' }} className={HANDLE_CLASSES} />
            <Handle type="source" position={Position.Bottom} id="right" style={{ left: '75%' }} className={HANDLE_CLASSES} />
        </div>
    );
};

export const ActionNode = ({ data }: CustomNodeProps) => {
    return (
        <div className={NODE_CLASSES}>
            <Handle type="target" position={Position.Top} className={HANDLE_CLASSES} />
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-black">
                    {data.icon || (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                    )}
                </div>
                <span className="font-outfit font-bold text-black text-[0.9rem]">{data.label}</span>
            </div>
            <p className="text-gray-500 text-xs font-inter m-0">{data.sublabel}</p>
            <Handle type="source" position={Position.Bottom} className={HANDLE_CLASSES} />
        </div>
    );
};
