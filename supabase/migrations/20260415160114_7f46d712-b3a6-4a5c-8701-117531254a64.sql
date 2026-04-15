
-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  message TEXT,
  image_url TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Global messages: everyone can view
CREATE POLICY "Anyone can view global messages"
ON public.chat_messages FOR SELECT
USING (group_id IS NULL);

-- Group messages: members can view
CREATE POLICY "Group members can view group messages"
ON public.chat_messages FOR SELECT
USING (group_id IS NOT NULL AND is_group_member(auth.uid(), group_id));

-- Anyone authenticated can send global messages
CREATE POLICY "Authenticated users can send global messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id AND group_id IS NULL);

-- Group members can send group messages
CREATE POLICY "Group members can send group messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id AND group_id IS NOT NULL AND is_group_member(auth.uid(), group_id));

-- Users can delete own messages
CREATE POLICY "Users can delete own messages"
ON public.chat_messages FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Storage bucket for chat photos
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-photos', 'chat-photos', true);

CREATE POLICY "Anyone can view chat photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-photos');

CREATE POLICY "Authenticated users can upload chat photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
