import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// 알림 생성 API
router.post('/create', async (req, res) => {
  const { user_id, from_user_id, diary_id, message, type } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: '필수 정보가 부족합니다.' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        from_user_id,
        diary_id,
        message,
        type
      })
      .select();

    if (error) {
      console.error('알림 생성 실패:', error);
      return res.status(500).json({ error: '알림 생성 실패' });
    }

    res.json({ success: true, notification: data[0] });
  } catch (error) {
    console.error('알림 API 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 일기 공유 시 팔로워들에게 알림 발송
router.post('/share-diary', async (req, res) => {
  const { user_id, diary_id, diary_title } = req.body;

  if (!user_id || !diary_id) {
    return res.status(400).json({ error: '필수 정보가 부족합니다.' });
  }

  try {
    // 팔로워 목록 조회
    const { data: followers, error: followError } = await supabase
      .from('subscriptions')
      .select('follower_id')
      .eq('following_id', user_id);

    if (followError) {
      console.error('팔로워 조회 실패:', followError);
      return res.status(500).json({ error: '팔로워 조회 실패' });
    }

    if (followers.length === 0) {
      return res.json({ success: true, message: '팔로워가 없습니다.' });
    }

    // 각 팔로워에게 알림 생성
    const notifications = followers.map(follower => ({
      user_id: follower.follower_id,
      from_user_id: user_id,
      diary_id: diary_id,
      message: `새로운 일기가 공유되었습니다: ${diary_title || '제목 없음'}`,
      type: 'diary_share'
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('알림 일괄 생성 실패:', error);
      return res.status(500).json({ error: '알림 생성 실패' });
    }

    res.json({ 
      success: true, 
      message: `${followers.length}명에게 알림을 발송했습니다.`
    });
  } catch (error) {
    console.error('일기 공유 알림 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 좋아요 알림
router.post('/like', async (req, res) => {
  const { diary_owner_id, liker_id, diary_id } = req.body;

  if (!diary_owner_id || !liker_id || !diary_id) {
    return res.status(400).json({ error: '필수 정보가 부족합니다.' });
  }

  // 자신의 일기에 자신이 좋아요를 누른 경우 알림 생성하지 않음
  if (diary_owner_id === liker_id) {
    return res.json({ success: true, message: '자신의 일기에는 알림을 보내지 않습니다.' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: diary_owner_id,
        from_user_id: liker_id,
        diary_id: diary_id,
        message: '누군가 당신의 일기에 좋아요를 눌렀습니다.',
        type: 'like'
      });

    if (error) {
      console.error('좋아요 알림 생성 실패:', error);
      return res.status(500).json({ error: '알림 생성 실패' });
    }

    res.json({ success: true, message: '좋아요 알림을 발송했습니다.' });
  } catch (error) {
    console.error('좋아요 알림 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 팔로우 알림
router.post('/follow', async (req, res) => {
  const { following_id, follower_id } = req.body;

  if (!following_id || !follower_id) {
    return res.status(400).json({ error: '필수 정보가 부족합니다.' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: following_id,
        from_user_id: follower_id,
        message: '새로운 팔로워가 생겼습니다!',
        type: 'follow'
      });

    if (error) {
      console.error('팔로우 알림 생성 실패:', error);
      return res.status(500).json({ error: '알림 생성 실패' });
    }

    res.json({ success: true, message: '팔로우 알림을 발송했습니다.' });
  } catch (error) {
    console.error('팔로우 알림 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

export default router;