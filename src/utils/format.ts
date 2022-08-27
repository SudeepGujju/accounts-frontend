export const formatAmount = (number: string|number) => { return (+number).toFixed(2) }

export const formatDate = (date: Date) => { return (""+date.getDate()).padStart(2, "0")+"/"+(""+(date.getMonth()+1)).padStart(2, "0")+"/"+date.getFullYear() }