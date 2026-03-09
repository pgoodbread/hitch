'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface FaqItem {
  question: string
  answer: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-slate-200">
      {items.map((item) => (
        <Disclosure as="div" key={item.question}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full items-center justify-between py-6 text-left">
                <span className="font-display text-lg text-slate-900">
                  {item.question}
                </span>
                <ChevronDown
                  className={clsx(
                    'ml-4 h-5 w-5 flex-none text-slate-500 transition-transform',
                    open && 'rotate-180',
                  )}
                />
              </DisclosureButton>
              <DisclosurePanel className="pb-6 text-sm text-slate-700">
                {item.answer}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
