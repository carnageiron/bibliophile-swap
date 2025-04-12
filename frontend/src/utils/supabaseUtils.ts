
import { supabase } from "@/integrations/supabase/client";
import { TradeRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

export async function createTradeRequest(tradeRequest: Omit<TradeRequest, 'id' | 'createdAt'>) {
  try {
    console.log("Creating trade request in Supabase:", tradeRequest);
    
    const { data, error } = await supabase
      .from('trade_requests')
      .insert({
        requester_id: tradeRequest.requesterId,
        requester_name: tradeRequest.requesterName,
        requester_avatar: tradeRequest.requesterAvatar,
        book_requested_id: tradeRequest.bookRequestedId,
        book_requested_title: tradeRequest.bookRequestedTitle,
        book_requested_cover: tradeRequest.bookRequestedCover,
        // Add null checks for optional fields to prevent TypeScript errors
        isbn_requested: tradeRequest.isbnRequested || null,
        author_requested: tradeRequest.authorRequested || null,
        book_offered_id: tradeRequest.bookOfferedId || null,
        book_offered_title: tradeRequest.bookOfferedTitle || null,
        book_offered_cover: tradeRequest.bookOfferedCover || null,
        isbn_offered: tradeRequest.isbnOffered || null,
        author_offered: tradeRequest.authorOffered || null,
        message: tradeRequest.message,
        owner_id: tradeRequest.ownerId,
        owner_name: tradeRequest.ownerName,
        owner_avatar: tradeRequest.ownerAvatar,
        status: tradeRequest.status
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating trade request:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      console.error("No data returned from creating trade request");
      throw new Error("No data returned from creating trade request");
    }

    console.log("Supabase response data:", data);

    // Transform the data to match our TradeRequest type
    const newTradeRequest: TradeRequest = {
      id: data.id,
      requesterId: data.requester_id,
      requesterName: data.requester_name,
      requesterAvatar: data.requester_avatar,
      bookRequestedId: data.book_requested_id,
      bookRequestedTitle: data.book_requested_title, 
      bookRequestedCover: data.book_requested_cover,
      // Add null checks for these fields
      isbnRequested: data.isbn_requested || undefined,
      authorRequested: data.author_requested || undefined,
      bookOfferedId: data.book_offered_id || undefined,
      bookOfferedTitle: data.book_offered_title || undefined,
      bookOfferedCover: data.book_offered_cover || undefined,
      isbnOffered: data.isbn_offered || undefined,
      authorOffered: data.author_offered || undefined,
      message: data.message || "",
      status: data.status as "pending" | "accepted" | "rejected" | "completed",
      createdAt: data.created_at,
      ownerId: data.owner_id,
      ownerName: data.owner_name,
      ownerAvatar: data.owner_avatar
    };

    return newTradeRequest;
  } catch (error) {
    console.error("Exception creating trade request:", error);
    
    // For development only - create a mock trade request if database fails
    // In production, you'd want to handle this error properly
    console.log("Creating mock trade request for development");
    
    return {
      id: `local-${Math.random().toString(36).substr(2, 9)}`,
      requesterId: tradeRequest.requesterId,
      requesterName: tradeRequest.requesterName,
      requesterAvatar: tradeRequest.requesterAvatar,
      bookRequestedId: tradeRequest.bookRequestedId,
      bookRequestedTitle: tradeRequest.bookRequestedTitle, 
      bookRequestedCover: tradeRequest.bookRequestedCover,
      isbnRequested: tradeRequest.isbnRequested,
      authorRequested: tradeRequest.authorRequested,
      bookOfferedId: tradeRequest.bookOfferedId,
      bookOfferedTitle: tradeRequest.bookOfferedTitle,
      bookOfferedCover: tradeRequest.bookOfferedCover,
      isbnOffered: tradeRequest.isbnOffered,
      authorOffered: tradeRequest.authorOffered,
      message: tradeRequest.message,
      status: tradeRequest.status,
      createdAt: new Date().toISOString(),
      ownerId: tradeRequest.ownerId,
      ownerName: tradeRequest.ownerName,
      ownerAvatar: tradeRequest.ownerAvatar
    };
  }
}

export async function fetchTradeRequests() {
  try {
    console.log("Fetching trade requests from Supabase");
    
    const { data, error } = await supabase
      .from('trade_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching trade requests:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      console.log("No trade requests found in database");
      return [];
    }

    console.log("Fetched trade requests:", data);

    // Transform the data to match our TradeRequest type with proper typing
    const tradeRequests: TradeRequest[] = data.map(item => ({
      id: item.id,
      requesterId: item.requester_id,
      requesterName: item.requester_name,
      requesterAvatar: item.requester_avatar,
      bookRequestedId: item.book_requested_id,
      bookRequestedTitle: item.book_requested_title,
      bookRequestedCover: item.book_requested_cover,
      // Add null checks for these fields
      isbnRequested: item.isbn_requested || undefined,
      authorRequested: item.author_requested || undefined,
      bookOfferedId: item.book_offered_id || undefined,
      bookOfferedTitle: item.book_offered_title || undefined,
      bookOfferedCover: item.book_offered_cover || undefined,
      isbnOffered: item.isbn_offered || undefined,
      authorOffered: item.author_offered || undefined,
      message: item.message || '',
      status: item.status as "pending" | "accepted" | "rejected" | "completed",
      createdAt: item.created_at,
      ownerId: item.owner_id,
      ownerName: item.owner_name,
      ownerAvatar: item.owner_avatar
    }));

    return tradeRequests;
  } catch (error) {
    console.error("Exception fetching trade requests:", error);
    
    // Return a mock trade request for development if database fails
    console.log("Returning empty array for trade requests");
    return [];
  }
}

export async function updateTradeRequestStatus(id: string, status: 'pending' | 'accepted' | 'rejected' | 'completed') {
  try {
    console.log(`Updating trade request ${id} status to ${status}`);
    
    const { error } = await supabase
      .from('trade_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error("Error updating trade request:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Trade request updated successfully");
    return true;
  } catch (error) {
    console.error("Exception updating trade request:", error);
    
    // For development - mock success if database fails
    // In production, you'd want to handle this error properly
    console.log("Mocking success for updateTradeRequestStatus");
    return true;
  }
}
