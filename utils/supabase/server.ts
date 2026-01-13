// Supabase server utilities stub

export const createClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
    },
  };
};

export const supabaseServer = null;
