'use client'
import { useUser } from '@/hooks/useUser'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import useAuthModal from '@/hooks/useAuthModal'
import { toast } from 'react-hot-toast'

interface LikeButtonProps {
	songId: string
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
	const router = useRouter()

	const { supabaseClient } = useSessionContext()

	const { user } = useUser()

	const authModal = useAuthModal()

	const [isLiked, setIsLiked] = useState<boolean>(false)

	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabaseClient
				.from('liked_songs')
				.select('*')
				.eq('user_id', user?.id)
				.eq('song_id', songId)
				.single()

			if (!error && data) {
				setIsLiked(true)
			}
		}

		fetchData()
	}, [songId, supabaseClient, user?.id])

	const handleLike = async () => {
		if (!user) return authModal.onOpen()

		if (isLiked) {
			const { data, error } = await supabaseClient
				.from('liked_songs')
				.delete()
				.eq('user_id', user.id)
				.eq('song_id', songId)

			if (error) toast.error(error.message)
			else setIsLiked(false)
		} else {
			const { error } = await supabaseClient
				.from('liked_songs')
				.insert({
					song_id: songId,
					user_id: user.id,
				})

			if (error) return toast.error(error.message)

			setIsLiked(true)

			toast.success('Liked!')
		}

		router.refresh()
	}
	const Icon = isLiked ? AiFillHeart : AiOutlineHeart

	return (
		<button onClick={handleLike} className='hover:opacity-75 transition'>
			<Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
		</button>
	)
}

export default LikeButton
