import { Error400, Error404, Error419 } from "../../api/errorPage";
import { EServiceKindError } from "../common/types";
import { ServiceError } from "../common/types/ServiceError";

interface ErrorPageProps {
  error: ServiceError;
}

export function ErrorPage({ error }: ErrorPageProps) {
  let cause: Error400 | Error404 | Error419 = new Error400();

  if (error.cause === EServiceKindError.RATE_LIMIT) {
    cause = new Error419();
  }

  if (error.cause === EServiceKindError.NOT_FOUND) {
    cause = new Error404("Sorry, the user you are looking for was not found.");
  }

  return cause;
}
