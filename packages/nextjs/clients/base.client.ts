import { useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import logger from "~~/services/logger.service";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export class HttpClient {
  protected authorizationToken?: string;
  protected get chainId() {
    return getTargetNetwork().id;
  }

  public authentify(authorizationToken?: string) {
    this.authorizationToken = authorizationToken;
    return this;
  }

  public async get<TRes = any>(url: string) {
    url = this.loadParams(url);
    const res = await fetch(url, {
      headers: [["authorization", this.authorizationToken ?? ""]],
    });
    const error = this.handleError(url, res);
    if (error) return { status: res.status, error, value: undefined, ok: false };

    return { status: res.status, value: (await res.json()) as TRes, ok: true };
  }

  public async post<TRes = any>(url: string, body?: any, headers?: [string, string][]) {
    url = this.loadParams(url);
    const res = await fetch(url, {
      method: "POST",
      body: body,
      headers: [["authorization", this.authorizationToken ?? ""], ...(headers ?? [])],
    });
    const error = this.handleError(url, res);
    if (error) return { status: res.status, error, value: undefined, ok: false };

    return { status: res.status, value: (await res.text()) as TRes, ok: true };
  }

  public async put<TRes = any>(url: string, body: any) {
    url = this.loadParams(url);
    const res = await fetch(url, {
      method: "PUT",
      body: body,
      headers: [["authorization", this.authorizationToken ?? ""]],
    });
    const error = this.handleError(url, res);
    if (error) return { status: res.status, error, value: undefined, ok: false };

    return { status: res.status, value: (await res.text()) as TRes, ok: true };
  }

  public async del(url: string) {
    url = this.loadParams(url);
    const res = await fetch(url, {
      method: "DELETE",
      headers: [["authorization", this.authorizationToken ?? ""]],
    });
    const error = this.handleError(url, res);
    if (error) return { status: res.status, error, value: undefined, ok: false };

    return { status: res.status, ok: true };
  }

  private handleError(url: string, res: Response) {
    if (res.status === 401) {
      const message = "Unauthorized";
      logger.error({ message, url });
      return message;
    }

    if (res.status === 500) {
      const message = "Server Error";
      logger.error({ message, url });
      return message;
    }

    if (res.status === 404) {
      const message = "Not Found";
      logger.error({ message, url });
      return message;
    }

    if (res.status === 400) {
      const message = "Bad Request";
      logger.error({ message, url });
      return message;
    }

    if (res.status === 403) {
      const message = "Forbidden";
      logger.error({ message, url });
      return message;
    }

    return undefined;
  }

  private loadParams(url: string) {
    url = appendQueryParam(url, "chainId", this.chainId.toString());
    return url;
  }
}

const useHttpClient = <TClient extends HttpClient>(client: TClient): TClient => {
  const { authToken } = useDynamicContext();

  useEffect(() => {
    if (authToken) {
      client.authentify(authToken);
    }
  }, [authToken]);

  return client ?? new HttpClient();
};

const appendQueryParam = (url: string, key: string, value: string) => {
  const [path, query] = url.split("?");
  const searchParams = new URLSearchParams(query);
  searchParams.append(key, value);
  return `${path}?${searchParams.toString()}`;
};

export default useHttpClient;
