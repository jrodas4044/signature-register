-- Soft delete for lideres: add deleted_at column
ALTER TABLE public.lideres ADD COLUMN deleted_at timestamptz;

CREATE INDEX idx_lideres_deleted_at ON public.lideres(deleted_at);
