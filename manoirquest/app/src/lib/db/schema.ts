// ── Types uniquement — plus de Drizzle ORM ──────────────────────────────────
// node:sqlite renvoie des Record<string, unknown>, on type ici pour la sécurité.

export type Role = 'parent' | 'child';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'manual';
export type TaskStatus = 'pending' | 'claimed' | 'awaiting_validation' | 'done' | 'refused';
export type RewardStatus = 'pending' | 'approved' | 'refused';
export type BadgeTrigger = 'total_points' | 'weekly_points' | 'streak_days' | 'task_count' | 'specific_task' | 'secret';

export interface User {
	id: number;
	name: string;
	avatar: string;
	role: Role;
	pin_hash: string;
	total_points: number;
	weekly_points: number;
	week_start: string;
	level: number;
	created_at: string;
}

export interface Task {
	id: number;
	name: string;
	emoji: string;
	description: string;
	points: number;
	difficulty: number;
	duration_min: number;
	recurrence: Recurrence;
	is_active: number;  // SQLite stores booleans as 0/1
	created_at: string;
}

export interface TaskInstance {
	id: number;
	task_id: number;
	assigned_to: number | null;
	due_date: string;
	week_start: string;
	status: TaskStatus;
	claimed_by: number | null;
	claimed_at: string | null;
	photo_url: string | null;
	refusal_reason: string | null;
	validated_by: number | null;
	validated_at: string | null;
	points_awarded: number | null;
	created_at: string;
	// Joined fields (populated by JOIN queries)
	task_name?: string;
	task_emoji?: string;
	task_points?: number;
	task_duration_min?: number;
	task_difficulty?: number;
	claimer_name?: string;
	claimer_avatar?: string;
}

export interface Badge {
	id: number;
	name: string;
	emoji: string;
	description: string;
	trigger_type: BadgeTrigger;
	trigger_value: number;
	trigger_task_id: number | null;
	is_secret: number;
	is_seasonal: number;
}

export interface UserBadge {
	id: number;
	user_id: number;
	badge_id: number;
	earned_at: string;
	// Joined
	badge_name?: string;
	badge_emoji?: string;
	badge_description?: string;
}

export interface Reward {
	id: number;
	name: string;
	emoji: string;
	description: string;
	cost: number;
	is_active: number;
}

export interface RewardClaim {
	id: number;
	reward_id: number;
	claimed_by: number;
	claimed_at: string;
	approved_by: number | null;
	status: RewardStatus;
	// Joined
	reward_name?: string;
	reward_emoji?: string;
	reward_cost?: number;
}

export interface Session {
	id: string;
	user_id: number;
	expires_at: string;
	created_at: string;
}
