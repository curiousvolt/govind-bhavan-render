import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { differenceInDays, parseISO } from 'date-fns';
import { useGuestRoom } from '../context/GuestRoomContext';
import { useAuth } from '../context/AuthContext';

const guestRoomSchema = z.object({
  guestName: z.string().min(2, 'Guest name is required'),
  relation: z.string().min(1, 'Relation is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guestsCount: z.number().min(1).max(3),
  roomType: z.enum(['AC', 'Non-AC']),
}).refine((data) => {
  const start = parseISO(data.checkIn);
  const end = parseISO(data.checkOut);
  return end > start;
}, {
  message: "Check-out must be after check-in",
  path: ["checkOut"]
});

type GuestRoomFormValues = z.infer<typeof guestRoomSchema>;

export const GuestRoomForm = () => {
  const [total, setTotal] = useState(0);
  const { addBooking } = useGuestRoom();
  const { user } = useAuth();
  
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<GuestRoomFormValues>({
    resolver: zodResolver(guestRoomSchema),
    defaultValues: {
      guestsCount: 1,
      roomType: 'Non-AC'
    }
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const roomType = watch('roomType');

  useEffect(() => {
    if (checkIn && checkOut) {
      const days = differenceInDays(parseISO(checkOut), parseISO(checkIn));
      if (days > 0) {
        const rate = roomType === 'AC' ? 500 : 300;
        setTotal(days * rate);
      } else {
        setTotal(0);
      }
    }
  }, [checkIn, checkOut, roomType]);

  const onSubmit = async (data: GuestRoomFormValues) => {
    if (!user) return;
    try {
      await addBooking({
        studentId: user._id,
        student: user.name,
        total,
        ...data,
      });
      toast.success('Guest room booking request submitted');
      reset();
      setTotal(0);
    } catch (error) {
      toast.error('Failed to submit booking');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Book Guest Room</h3>
        <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Accommodation</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Guest Name</label>
          <input 
            type="text" 
            {...register('guestName')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
          {errors.guestName && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.guestName.message}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Relation</label>
          <select 
            {...register('relation')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm custom-select"
          >
            <option value="">Select relation</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Relative">Relative</option>
            <option value="Friend">Friend</option>
          </select>
          {errors.relation && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.relation.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Check-in Date</label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            {...register('checkIn')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
          {errors.checkIn && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.checkIn.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Check-out Date</label>
          <input 
            type="date" 
            min={checkIn || new Date().toISOString().split('T')[0]}
            {...register('checkOut')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
          {errors.checkOut && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.checkOut.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Number of Guests</label>
          <input 
            type="number" 
            min="1" max="3"
            {...register('guestsCount', { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
          {errors.guestsCount && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.guestsCount.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Room Type</label>
          <select 
            {...register('roomType')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm custom-select"
          >
            <option value="Non-AC">Non-AC (₹300/night)</option>
            <option value="AC">AC (₹500/night)</option>
          </select>
        </div>
      </div>

      <div className="bg-primary-50/50 dark:bg-primary-900/10 p-5 rounded-2xl flex justify-between items-center mt-4 border border-primary-100 dark:border-primary-500/10">
        <span className=" font-bold text-gray-900 dark:text-white">Estimated Total:</span>
        <span className="text-2xl  font-bold text-primary-600 dark:text-primary-400">₹{total}</span>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || total === 0}
        className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white  font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 shadow-lg shadow-primary-600/20"
      >
        {isSubmitting ? 'Processing...' : 'Confirm Booking Request'}
      </button>
    </form>
  );
};
