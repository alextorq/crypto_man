const KEY = '__userPreference__';

interface Data {
  meta: {
      createdAt: number,
      updatedAt: number,
  };
  value: unknown;
}

export default class UserPreference {

    private static getAll(): Record<string, Data> {
        return JSON.parse(localStorage.getItem(KEY) || '{}');
    }

    private static createData(value: unknown) {
        return {
            meta: {
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
            },
            value,
        };
    }

    //TODO updatedAt
    public static save(key: string, value: unknown) {
        const all = UserPreference.getAll();
        all[key] = UserPreference.createData(value);
        localStorage.setItem(KEY, JSON.stringify(all));
    }

    public static get<T = unknown>(key: string, defaultValue: T): T {
        const value = UserPreference.getAll()[key];
        if (value) {
            return value.value as T;
        }
        return defaultValue;
    }

}
