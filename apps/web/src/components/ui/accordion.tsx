import * as React from 'react';

import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '@/lib/utils';

/**
 * shadcn/ui Accordion primitives (Radix wrappers).
 *
 * These are intentionally minimal, unstyled building blocks. The styled,
 * stepper-flavoured accordion the app renders lives in
 * `@/components/common/Accordion`, which composes these.
 */

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  // Radix's <Header> defaults to an <h3>; the app's heading outline needs the
  // step titles at <h2> (directly under the page <h1>, no skipped level). Render
  // the header as an <h2> via `asChild`. Purely a semantic/level change — with
  // Tailwind Preflight resetting heading margins/size to inherit, h2 vs h3 render
  // identically, so there is no visual effect.
  <AccordionPrimitive.Header asChild>
    <h2 className="flex">
      <AccordionPrimitive.Trigger ref={ref} className={cn(className)} {...props}>
        {children}
      </AccordionPrimitive.Trigger>
    </h2>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, style, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* Padding lives on the inner wrapper so the outer height animation stays clean. */}
    <div className={cn(className)} style={style}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
