import { useState } from 'react'
import { MENU, type CoffeeItem, type CoffeeOption } from '@/data/menu'

type Selection = {
  selected: number
  /** Her kahve için seçili seçeneğin sırası; satırlar arasında gezinince seçim korunur. */
  options: number[]
}

export type CurrentCoffee = {
  item: CoffeeItem
  option: CoffeeOption
  /** Forma konu olarak taşınan etiket, ör. "Espresso · Duble". */
  label: string
}

export function useCoffeeSelection(menu: CoffeeItem[] = MENU) {
  const [state, setState] = useState<Selection>(() => ({
    selected: 0,
    options: menu.map((item) => item.defaultOption),
  }))

  const select = (index: number) => setState((prev) => ({ ...prev, selected: index }))

  const setOption = (index: number, option: number) =>
    setState((prev) => ({
      ...prev,
      options: prev.options.map((value, i) => (i === index ? option : value)),
    }))

  const optionFor = (index: number) => state.options[index]

  const item = menu[state.selected]
  const option = item.options[state.options[state.selected]]
  const current: CurrentCoffee = { item, option, label: `${item.name} · ${option.label}` }

  return { selectedIndex: state.selected, select, optionFor, setOption, current }
}
