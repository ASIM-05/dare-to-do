
-- Create a security definer function to check group membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id uuid, _group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE user_id = _user_id
      AND group_id = _group_id
  )
$$;

-- Fix group_members SELECT policy (was self-referencing)
DROP POLICY IF EXISTS "Members can view group members" ON public.group_members;
CREATE POLICY "Members can view group members"
ON public.group_members
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.is_group_member(auth.uid(), group_id)
);

-- Fix groups SELECT policy
DROP POLICY IF EXISTS "Group members can view groups" ON public.groups;
CREATE POLICY "Group members can view groups"
ON public.groups
FOR SELECT
USING (public.is_group_member(auth.uid(), id));

-- Fix tasks SELECT policy
DROP POLICY IF EXISTS "Group members can view tasks" ON public.tasks;
CREATE POLICY "Group members can view tasks"
ON public.tasks
FOR SELECT
USING (
  group_id IS NOT NULL
  AND public.is_group_member(auth.uid(), group_id)
);

-- Fix dare_assignments policies
DROP POLICY IF EXISTS "Group members can view dare assignments" ON public.dare_assignments;
CREATE POLICY "Group members can view dare assignments"
ON public.dare_assignments
FOR SELECT
USING (
  group_id IS NOT NULL
  AND public.is_group_member(auth.uid(), group_id)
);

DROP POLICY IF EXISTS "Group members can create dare assignments" ON public.dare_assignments;
CREATE POLICY "Group members can create dare assignments"
ON public.dare_assignments
FOR INSERT
WITH CHECK (public.is_group_member(auth.uid(), group_id));
