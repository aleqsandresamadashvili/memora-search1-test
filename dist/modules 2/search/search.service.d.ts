export interface SearchFilters {
    query?: string;
    subjectIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    lessonType?: 'STUDENT_TO_TUTOR' | 'TUTOR_TO_STUDENT' | 'ONLINE';
    countryCode?: string;
    sortBy?: 'recommended' | 'highest_rated' | 'most_demanded' | 'price_asc' | 'price_desc' | 'newest';
    cursor?: string;
    limit?: number;
}
export declare class SearchService {
    searchTutors(filters: SearchFilters): Promise<{
        tutors: {
            id: string;
            firstName: any;
            lastName: any;
            bio: string | null;
            avgRating: number;
            ratingCount: any;
            minPrice: number;
            teachingHours: any;
            verifiedTrusted: any;
            pinnedComment: string | null;
            subjects: any;
            lessonFormats: {
                studentToTutor: boolean;
                tutorToStudent: boolean;
                online: boolean;
            };
            yearsExperience: number | null;
            introVideoUrl: any;
        }[];
        hasMore: boolean;
        nextCursor: string | null | undefined;
    }>;
    getSubjects(countryCode?: string): Promise<({
        subjects: {
            name: string;
            id: string;
        }[];
    } & {
        name: string;
        id: string;
        countryId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
//# sourceMappingURL=search.service.d.ts.map