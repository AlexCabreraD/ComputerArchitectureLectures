export interface VideoGroup {
    topicName: string
    videos: string[]
}

export interface VideoData extends Array<VideoGroup> {}