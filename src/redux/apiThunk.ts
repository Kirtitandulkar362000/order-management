import { createAsyncThunk } from "@reduxjs/toolkit";


 interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function createApiThunk<Returned, Arg>(
  type: string,
  asyncFunc: (arg: Arg) => Promise<Returned>
) {
  return createAsyncThunk<Returned, Arg, { rejectValue: ApiError }>(
    type,
    async (arg, thunkAPI) => {
      try {
        return await asyncFunc(arg);
      } catch (err: any) {
        const error: ApiError = {
          message:
            err.response?.data?.message ||
            err.response?.data?.errors ||
            "Network error",
          status: err.response?.status || 500,
        };

        return thunkAPI.rejectWithValue(error);
      }
    }
  );
}