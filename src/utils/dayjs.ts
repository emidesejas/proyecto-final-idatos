import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Duration from "dayjs/plugin/duration";

import "dayjs/locale/es";

import dayjs from "dayjs";

dayjs.extend(LocalizedFormat);
dayjs.extend(Duration);

dayjs.locale("es");

export default dayjs;
