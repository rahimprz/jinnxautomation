import { app } from './app.mjs'

const PORT = Number(process.env.PORT || 8080)
app.listen(PORT, () => console.log(`JinnxAutomation listening on :${PORT}`))
