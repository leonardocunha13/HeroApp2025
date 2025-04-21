"use client";

import { useState } from "react";
import DesignerSidebar from "./DesignerSideBar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { cn } from "../lib/utils";
import useDesigner from "./hooks/useDesigner";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./FormElements";
import { idGenerator } from "../lib/idGenerator";
import { BiSolidTrash } from "react-icons/bi";
import { Grid, View, Text, Button } from "@aws-amplify/ui-react";

function Designer() {
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement,
  } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: { isDesignerDropArea: true },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;
      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      const droppingSidebarBtnOverDesignerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;
      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement =
          FormElements[type as ElementsType].construct(idGenerator());
        addElement(elements.length, newElement);
        return;
      }

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement =
          FormElements[type as ElementsType].construct(idGenerator());

        const overId = over.data?.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) throw new Error("Element not found");

        const indexForNewElement = isDroppingOverDesignerElementBottomHalf
          ? overElementIndex + 1
          : overElementIndex;
        addElement(indexForNewElement, newElement);
        return;
      }

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId,
        );
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1)
          throw new Error("Element not found");

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        const indexForNewElement = isDroppingOverDesignerElementBottomHalf
          ? overElementIndex + 1
          : overElementIndex;
        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <Grid
      templateColumns={{ base: '1fr', medium: '1fr auto' }}
      className="w-full h-full"
    >
      {/* Canvas Area */}
      <View
        padding="1.5rem"
        overflow="auto"
        height="100%"
        onClick={() => selectedElement && setSelectedElement(null)}
      >
        <View
          ref={droppable.setNodeRef}
          className={cn(
            'bg-muted max-w-[920px] min-h-[600px] mx-auto rounded-2xl flex flex-col items-center justify-start overflow-hidden border border-border shadow transition-all duration-200',
            droppable.isOver && 'ring-4 ring-primary/50 ring-inset',
          )}
        >
          {elements.length === 0 ? (
            <View className="flex-1 m-8 p-12 bg-background rounded-xl border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground">
              <Text
                as="p"
                className={cn(
                  'text-2xl font-semibold text-center',
                  droppable.isOver && 'animate-pulse text-primary',
                )}
              >
                Drop elements here
              </Text>
            </View>
          ) : (
            <View className="flex flex-col w-full gap-4 p-6">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Sidebar */}
      <View
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <DesignerSidebar />
      </View>
    </Grid>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const { removeElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className={cn(
        "relative h-[120px] flex flex-col rounded-xl border border-muted bg-muted shadow-md",
        "hover:border-primary hover:shadow-lg transition-all duration-200",
        "cursor-grab active:cursor-grabbing",
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2 rounded-t-xl" />
      <div ref={bottomHalf.setNodeRef} className="absolute bottom-0 w-full h-1/2 rounded-b-xl" />

      {mouseIsOver && (
        <>
          <div className="absolute top-2 right-2 z-10">
            <Button
              size="small"
              variation="link"
              className="rounded-full shadow bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className="h-5 w-5 text-white" />
            </Button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <p className="text-sm text-white bg-black/50 px-3 py-1 rounded-lg shadow border border-white/20">
              Click to edit or drag to move
            </p>
          </div>
        </>
      )}

      {topHalf.isOver && (
        <div className="absolute top-0 w-full h-[6px] bg-blue-500 rounded-md rounded-b-none" />
      )}

      <div
        className={cn(
          "flex w-full h-full items-center justify-start px-4 py-2 transition-opacity duration-200",
          mouseIsOver ? "opacity-40" : "opacity-100",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>

      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full h-[6px] bg-blue-500 rounded-md rounded-t-none" />
      )}
    </div>
  );
}

export default Designer;