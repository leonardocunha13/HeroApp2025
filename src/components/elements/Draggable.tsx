import {useDraggable} from '@dnd-kit/core';
import {DraggableSyntheticListeners} from '@dnd-kit/core';

interface DraggableProps {
    children: React.ReactNode;
}

interface DraggableAttributes {
    [key: string]: any;
}

function Draggable(props: DraggableProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    }: {
        attributes: DraggableAttributes;
        listeners: DraggableSyntheticListeners;
        setNodeRef: (node: HTMLElement | null) => void;
        transform: { x: number; y: number } | null;
    } = useDraggable({
        id: 'draggable',
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      } : undefined;

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
}

export default Draggable;