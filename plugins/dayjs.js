import dayjs from "dayjs"
import "dayjs/locale/de"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.locale("de")
dayjs.extend(relativeTime)
