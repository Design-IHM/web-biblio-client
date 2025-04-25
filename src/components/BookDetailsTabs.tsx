// src/components/BookDetailsTabs.jsx
import { useState } from 'react';
import { Star, MessageCircle, BookOpen } from 'lucide-react';

const BookDetailsTabs = ({ book }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <div className="py-8">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-4 font-medium text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'summary'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={18} className="inline-block mr-2 -mt-1" />
            Résumé
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 font-medium text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Détails
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 font-medium text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Star size={18} className="inline-block mr-2 -mt-1" />
            Avis ({book.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-4 font-medium text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'comments'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle size={18} className="inline-block mr-2 -mt-1" />
            Commentaires
          </button>
        </div>
      </div>
      
      <div className="py-6">
        {activeTab === 'summary' && (
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              {book.summary || 'Résumé non disponible.'}
            </p>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informations</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Titre original</dt>
                    <dd className="font-medium text-gray-800">{book.originalTitle || book.title}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">ISBN</dt>
                    <dd className="font-medium text-gray-800">{book.isbn || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Langue</dt>
                    <dd className="font-medium text-gray-800">{book.language || 'Français'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Format</dt>
                    <dd className="font-medium text-gray-800">{book.format || 'Numérique'}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Publication</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Éditeur</dt>
                    <dd className="font-medium text-gray-800">{book.publisher || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Date de publication</dt>
                    <dd className="font-medium text-gray-800">{book.publicationDate || book.year}</dd>
                    </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Édition</dt>
                    <dd className="font-medium text-gray-800">{book.edition || '1ère édition'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Collection</dt>
                    <dd className="font-medium text-gray-800">{book.collection || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {book.tableOfContents && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Table des matières</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2">
                    {book.tableOfContents.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-4xl font-bold text-gray-800">{book.rating}</div>
                  <div className="flex mt-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className="text-primary mr-1" 
                        fill={i < Math.floor(book.rating) ? "#ff8c00" : "transparent"} 
                        stroke={i < Math.floor(book.rating) ? "#ff8c00" : "#cbd5e0"}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Basé sur {book.reviews?.length || 0} avis
                  </div>
                </div>
                
                <div className="flex-1 max-w-xs">
                  {[5, 4, 3, 2, 1].map(num => {
                    const count = book.reviews?.filter(r => Math.floor(r.rating) === num).length || 0;
                    const percentage = book.reviews?.length ? (count / book.reviews.length) * 100 : 0;
                    
                    return (
                      <div key={num} className="flex items-center text-sm mb-1">
                        <div className="w-8 text-gray-600">{num}</div>
                        <Star size={12} className="text-primary mr-2" fill="#ff8c00" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-9 text-right text-gray-500">{percentage.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
                Écrire un avis
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {book.reviews ? (
                book.reviews.map((review, index) => (
                  <div key={index} className="py-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <img
                          src={review.userAvatar || "/api/placeholder/40/40"}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{review.userName}</h4>
                          <div className="flex items-center mt-1">
                            <div className="flex mr-2">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  className="text-primary mr-1" 
                                  fill={i < Math.floor(review.rating) ? "#ff8c00" : "transparent"} 
                                  stroke={i < Math.floor(review.rating) ? "#ff8c00" : "#cbd5e0"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-3 text-gray-700">
                      <p>{review.comment}</p>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <button className="flex items-center text-gray-500 hover:text-primary">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                        Utile ({review.helpful || 0})
                      </button>
                      
                      <button className="flex items-center text-gray-500 hover:text-primary ml-4">
                        <MessageCircle size={14} className="mr-1" />
                        Répondre
                      </button>
                    </div>
                    
                    {review.replies && review.replies.length > 0 && (
                      <div className="mt-4 pl-8 space-y-4">
                        {review.replies.map((reply, replyIndex) => (
                          <div key={replyIndex} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start">
                              <img
                                src={reply.userAvatar || "/api/placeholder/32/32"}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <div>
                                <h5 className="font-medium text-gray-800">{reply.userName}</h5>
                                <div className="text-sm text-gray-500">{reply.date}</div>
                                <p className="mt-1 text-gray-700">{reply.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'comments' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Commentaires ({book.comments?.length || 0})</h3>
              <div className="flex">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Partagez vos pensées..."
                    rows={3}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
                      Commenter
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {book.comments ? (
                book.comments.map((comment, index) => (
                  <div key={index} className="py-6">
                    <div className="flex">
                      <img
                        src={comment.userAvatar || "/api/placeholder/40/40"}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-800">{comment.userName}</h4>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.text}</p>
                        <div className="mt-3 flex items-center text-sm">
                          <button className="text-gray-500 hover:text-primary">J'aime ({comment.likes || 0})</button>
                          <span className="mx-2 text-gray-300">•</span>
                          <button className="text-gray-500 hover:text-primary">Répondre</button>
                        </div>
                        
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-6 space-y-4">
                            {comment.replies.map((reply, replyIndex) => (
                              <div key={replyIndex} className="flex">
                                <img
                                  src={reply.userAvatar || "/api/placeholder/32/32"}
                                  alt={reply.userName}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h5 className="font-medium text-gray-800">{reply.userName}</h5>
                                    <span className="text-xs text-gray-500">{reply.date}</span>
                                  </div>
                                  <p className="mt-1 text-gray-700">{reply.text}</p>
                                  <div className="mt-2 flex items-center text-xs">
                                    <button className="text-gray-500 hover:text-primary">J'aime ({reply.likes || 0})</button>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <button className="text-gray-500 hover:text-primary">Répondre</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsTabs;